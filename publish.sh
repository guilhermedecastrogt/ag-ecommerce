#!/bin/sh
PAYLOAD='{"orderId":10001,"userId":1,"items":[{"productId":"1","name":"Filtro de Oleo","price":45.90,"quantity":1}],"addressSnapshot":"{\"name\":\"Joao Silva\",\"street\":\"Praca da Se\",\"number\":\"123\",\"neighborhood\":\"Se\",\"city\":\"Sao Paulo\",\"state\":\"SP\",\"zipCode\":\"01001000\"}","shippingFee":29.90,"total":75.80,"paidAt":"2026-04-08T17:00:00.000Z"}'
echo "$PAYLOAD" | kafka-console-producer --broker-list localhost:9092 --topic order.paid
