import type { BacktestCondition, BacktestIndicator, ConditionOperand, ConditionOperator } from "@spider/types";

interface Props {
  condition: BacktestCondition;
  onChange: (condition: BacktestCondition) => void;
  onRemove: () => void;
}

const INDICATOR_LABELS: Record<BacktestIndicator, string> = {
  rsi: "RSI",
  ema: "EMA",
  macd_histogram: "Histograma MACD",
  vwap: "VWAP",
  price: "Precio",
};

const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  gt: "es mayor que",
  lt: "es menor que",
  crosses_above: "cruza por arriba de",
  crosses_below: "cruza por abajo de",
};

const DEFAULT_PERIOD: Partial<Record<BacktestIndicator, number>> = { rsi: 14, ema: 20 };

function defaultIndicatorOperand(indicator: BacktestIndicator): ConditionOperand {
  const period = DEFAULT_PERIOD[indicator];
  return period !== undefined ? { indicator, period } : { indicator };
}

function OperandEditor({
  operand,
  onChange,
  fixedValueDefault,
}: {
  operand: ConditionOperand;
  onChange: (operand: ConditionOperand) => void;
  fixedValueDefault: number;
}) {
  const isValue = "value" in operand;

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={isValue ? "__value__" : operand.indicator}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "__value__" ? { value: fixedValueDefault } : defaultIndicatorOperand(v as BacktestIndicator));
        }}
        className="bg-void-panel border border-void-border rounded-lg px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-neon-blue/50"
      >
        <option value="__value__">Valor fijo</option>
        {(Object.keys(INDICATOR_LABELS) as BacktestIndicator[]).map((ind) => (
          <option key={ind} value={ind}>
            {INDICATOR_LABELS[ind]}
          </option>
        ))}
      </select>

      {isValue ? (
        <input
          type="number"
          value={operand.value}
          onChange={(e) => onChange({ value: Number(e.target.value) })}
          className="w-20 bg-void-panel border border-void-border rounded-lg px-2 py-1.5 text-xs value-mono text-slate-100 outline-none focus:border-neon-blue/50"
        />
      ) : (
        DEFAULT_PERIOD[operand.indicator] !== undefined && (
          <input
            type="number"
            min={1}
            value={operand.period ?? DEFAULT_PERIOD[operand.indicator]}
            onChange={(e) => onChange({ indicator: operand.indicator, period: Number(e.target.value) })}
            className="w-16 bg-void-panel border border-void-border rounded-lg px-2 py-1.5 text-xs value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            title="Período"
          />
        )
      )}
    </div>
  );
}

export function ConditionRow({ condition, onChange, onRemove }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-void-soft rounded-lg p-2.5">
      <OperandEditor operand={condition.left} onChange={(left) => onChange({ ...condition, left })} fixedValueDefault={30} />

      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value as ConditionOperator })}
        className="bg-void-panel border border-void-border rounded-lg px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-neon-blue/50"
      >
        {(Object.keys(OPERATOR_LABELS) as ConditionOperator[]).map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>

      <OperandEditor operand={condition.right} onChange={(right) => onChange({ ...condition, right })} fixedValueDefault={0} />

      <button onClick={onRemove} className="ml-auto text-neon-red text-xs font-mono px-2 py-1 hover:bg-neon-red/10 rounded">
        Quitar
      </button>
    </div>
  );
}
