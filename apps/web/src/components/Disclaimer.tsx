export function Disclaimer({ text }: { text?: string }) {
  return (
    <p className="nfa-disclaimer">
      {text ??
        "Esta información es contexto de mercado, no asesoría financiera (NFA — Not Financial Advice). Ninguna señal técnica es una recomendación de compra o venta."}
    </p>
  );
}
