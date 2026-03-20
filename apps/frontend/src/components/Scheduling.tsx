"use client";

import { useState } from "react";
import { IconCalendar, IconPhone } from "./Icons";

export default function Scheduling() {
  const [hasCadastro, setHasCadastro] = useState(false);

  return (
    <section id="agendamento" className="relative py-24 lg:py-32 bg-blue overflow-hidden">
      {/* Decorative white cutout */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-red" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      <div className="geo-shape text-white -right-32 top-20 !w-[400px] !h-[400px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: info */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <IconCalendar className="w-4 h-4 text-red" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">
                Agendamento
              </span>
            </div>

            <h2 className="font-[var(--font-display)] text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] leading-tight mb-4">
              Agende seu{" "}
              <span className="text-red">serviço</span>
            </h2>

            <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
              Agende diagnósticos, reparos ou manutenção em veículos diesel.
              Nossa equipe retorna o contato para confirmar data e horário.
            </p>

            {/* Info blocks */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-red">
                  <IconPhone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-white/50 text-xs tracking-wider uppercase block">Telefone</span>
                  <a href="tel:+556240086363" className="text-white font-bold text-lg hover:text-red transition-colors">
                    (62) 4008-6363
                  </a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="font-[var(--font-display)] text-white/80 text-sm font-bold tracking-wider uppercase block mb-3">
                  Horários de atendimento
                </span>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/50 block">Seg a Sex</span>
                    <span className="text-white font-semibold">08h às 18h</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Sábado</span>
                    <span className="text-white font-semibold">08h às 12h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal">
            <form
              className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/20"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="font-[var(--font-display)] text-blue text-xl font-bold tracking-wider uppercase mb-6">
                Solicitar Agendamento
              </h3>

              <div className="space-y-4">
                {/* Cadastro toggle */}
                <div className="flex items-center justify-between bg-neutral-light rounded-xl p-4">
                  <span className="text-sm font-medium text-neutral-dark/70">
                    Já possui cadastro?
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${!hasCadastro ? "text-blue" : "text-neutral-dark/30"}`}>
                      Não
                    </span>
                    <button
                      type="button"
                      className={`toggle-switch ${hasCadastro ? "active" : ""}`}
                      onClick={() => setHasCadastro(!hasCadastro)}
                      aria-label="Já possui cadastro"
                    />
                    <span className={`text-xs font-bold uppercase tracking-wider ${hasCadastro ? "text-red" : "text-neutral-dark/30"}`}>
                      Sim
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-dark/50 tracking-wider uppercase block mb-1.5">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full border border-neutral-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-dark/50 tracking-wider uppercase block mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full border border-neutral-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-dark/50 tracking-wider uppercase block mb-1.5">
                    Tipo de veículo / aplicação
                  </label>
                  <select className="w-full border border-neutral-border rounded-xl px-4 py-3 text-sm text-neutral-dark/70 focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all bg-white">
                    <option value="">Selecione</option>
                    <option>Caminhão</option>
                    <option>Ônibus / Micro-ônibus</option>
                    <option>Máquina Agrícola</option>
                    <option>Máquina Pesada</option>
                    <option>Picape / Van</option>
                    <option>Náutico</option>
                    <option>Outro Motor</option>
                    <option>Módulo Eletrônico</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-dark/50 tracking-wider uppercase block mb-1.5">
                    Melhor dia / horário
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: segunda pela manhã"
                    className="w-full border border-neutral-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-dark/50 tracking-wider uppercase block mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva brevemente o problema ou serviço desejado"
                    className="w-full border border-neutral-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red transition-all resize-none"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full !py-4 text-base mt-2">
                  Confirmar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
