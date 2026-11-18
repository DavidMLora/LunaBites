interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
}
export default function QuantityControl({ value, onChange, label, min = 1 }: Props) {
  return (
    <div className="quantity-control" role="group" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        aria-label={`Reducir ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-label={`Cantidad seleccionada de ${label}`}>{value}</output>
      <button
        type="button"
        aria-label={`Aumentar ${label}`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
