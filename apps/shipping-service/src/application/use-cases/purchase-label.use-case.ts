import { Injectable, Logger } from '@nestjs/common';
import { MelhorEnvioClient, CartItemPayload } from '../../infrastructure/melhor-envio.client';
import { ShippingPrismaService } from '../../shipping-prisma.service';

export interface OrderPaidPayload {
  orderId: number;
  userId: number;
  items: { productId: string; name: string; price: number; quantity: number }[];
  addressSnapshot: string | null;
  shippingFee: number;
  total: number;
  paidAt: string;
}

interface AddressSnapshot {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

@Injectable()
export class PurchaseLabelUseCase {
  private readonly logger = new Logger(PurchaseLabelUseCase.name);

  constructor(
    private readonly melhorEnvioClient: MelhorEnvioClient,
    private readonly prisma: ShippingPrismaService,
  ) {}

  async execute(payload: OrderPaidPayload): Promise<void> {
    const { orderId, items, addressSnapshot, total } = payload;

    // Idempotência: não comprar etiqueta duas vezes para o mesmo pedido
    const existing = await this.prisma.shipmentLabel.findUnique({ where: { orderId } });
    if (existing) {
      this.logger.warn(`Label already purchased for orderId=${orderId}. Skipping.`);
      return;
    }

    // Parsear endereço do destinatário
    let toAddress: AddressSnapshot;
    try {
      toAddress = JSON.parse(addressSnapshot ?? '{}') as AddressSnapshot;
    } catch {
      this.logger.error(`Invalid addressSnapshot for orderId=${orderId}. Cannot purchase label.`);
      return;
    }

    if (!toAddress.zipCode) {
      this.logger.error(`Missing zipCode in addressSnapshot for orderId=${orderId}. Cannot purchase label.`);
      return;
    }

    // Dimensões e dados do remetente via env vars
    const serviceId = Number(process.env.MELHOR_ENVIO_SERVICE_ID ?? 1);
    const defaultWeight = parseFloat(process.env.MELHOR_ENVIO_DEFAULT_WEIGHT ?? '0.3');
    const defaultHeight = Number(process.env.MELHOR_ENVIO_DEFAULT_HEIGHT ?? 10);
    const defaultWidth  = Number(process.env.MELHOR_ENVIO_DEFAULT_WIDTH  ?? 15);
    const defaultLength = Number(process.env.MELHOR_ENVIO_DEFAULT_LENGTH ?? 20);

    const cartPayload: CartItemPayload = {
      service: serviceId,
      from: {
        name:       process.env.MELHOR_ENVIO_SENDER_NAME     ?? 'Águia Diesel',
        phone:      process.env.MELHOR_ENVIO_SENDER_PHONE    ?? '62999999999',
        email:      process.env.MELHOR_ENVIO_SENDER_EMAIL    ?? 'suporte@aguiadiesel.com.br',
        document:   process.env.MELHOR_ENVIO_SENDER_DOCUMENT ?? '00000000000000',
        address:    process.env.MELHOR_ENVIO_SENDER_ADDRESS  ?? 'Rua Exemplo',
        number:     process.env.MELHOR_ENVIO_SENDER_NUMBER   ?? '1',
        district:   process.env.MELHOR_ENVIO_SENDER_DISTRICT ?? 'Centro',
        city:       process.env.MELHOR_ENVIO_SENDER_CITY     ?? 'Goiânia',
        state_abbr: process.env.MELHOR_ENVIO_SENDER_STATE    ?? 'GO',
        postal_code: (process.env.MELHOR_ENVIO_SENDER_POSTAL_CODE ?? '74000000').replace(/\D/g, ''),
        country_id: 'BR',
      },
      to: {
        name:       toAddress.name        ?? 'Destinatário',
        phone:      process.env.MELHOR_ENVIO_DEFAULT_RECIPIENT_PHONE ?? '00000000000',
        email:      process.env.MELHOR_ENVIO_DEFAULT_RECIPIENT_EMAIL ?? 'destinatario@example.com',
        document:   process.env.MELHOR_ENVIO_DEFAULT_RECIPIENT_DOCUMENT ?? '00000000000',
        address:    toAddress.street      ?? '',
        number:     toAddress.number      ?? 's/n',
        district:   toAddress.neighborhood ?? '',
        city:       toAddress.city        ?? '',
        state_abbr: toAddress.state       ?? '',
        postal_code: (toAddress.zipCode ?? '').replace(/\D/g, ''),
        country_id: 'BR',
      },
      products: items.map((item) => ({
        name:           item.name,
        quantity:       item.quantity,
        unitary_value:  item.price,
        weight:         defaultWeight,
      })),
      volumes: [
        {
          height: defaultHeight,
          width:  defaultWidth,
          length: defaultLength,
          weight: defaultWeight * items.reduce((sum, i) => sum + i.quantity, 0),
        },
      ],
      options: {
        insurance_value: total,
        receipt:         false,
        own_hand:        false,
        reverse:         false,
        non_commercial:  false,
        tags: [{ tag: `order-${orderId}`, url: null }],
      },
    };

    this.logger.log(`Adding order=${orderId} to Melhor Envio cart...`);
    let cartItem: any;
    try {
      cartItem = await this.melhorEnvioClient.addToCart(cartPayload);
    } catch (err) {
      this.logger.error(`Failed to add order=${orderId} to cart: ${(err as Error).message}`);
      return;
    }

    const cartItemId: string = cartItem?.id;
    if (!cartItemId) {
      this.logger.error(`No cart item ID returned for order=${orderId}. Response: ${JSON.stringify(cartItem)}`);
      return;
    }

    this.logger.log(`Cart item created: ${cartItemId}. Checking out...`);
    let checkoutResult: any[];
    try {
      checkoutResult = await this.melhorEnvioClient.checkoutCart([cartItemId]);
    } catch (err) {
      this.logger.error(`Checkout failed for order=${orderId} (cartItemId=${cartItemId}): ${(err as Error).message}`);
      return;
    }

    const purchased = Array.isArray(checkoutResult) ? checkoutResult[0] : checkoutResult;

    await this.prisma.shipmentLabel.create({
      data: {
        orderId,
        cartItemId,
        serviceId,
        serviceName: purchased?.service?.name ?? `Service ${serviceId}`,
        trackingCode: purchased?.tracking ?? null,
        labelUrl:     purchased?.label?.url ?? null,
        price:        purchased?.price ?? null,
        status:       'PURCHASED',
      },
    });

    this.logger.log(`Label purchased successfully for order=${orderId}. Tracking: ${purchased?.tracking ?? 'pending'}`);
  }
}
