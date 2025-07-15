import { Radio, RadioGroup } from "@heroui/radio";

type TipFormProps = {
  subtotal: number;
  setTipAmount: (amount: number) => void;
};

export default function TipForm({ subtotal, setTipAmount }: TipFormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 block">
        Optional: Add a tip
        <div className="text-sm text-gray-500">
          This will support our services and help us continue to offer you low
          fees and great rates.
        </div>
      </h3>

      <RadioGroup
        className="flex space-x-2"
        orientation="horizontal"
        onValueChange={(value) => setTipAmount(parseFloat(value))}
      >
        <Radio id="tip-0" value="0">
          No tip
        </Radio>
        <Radio id="tip-10" value={`${subtotal * 0.1}`}>
          10% (${(subtotal * 0.1).toFixed(2)})
        </Radio>
        <Radio id="tip-15" value={`${subtotal * 0.15}`}>
          15% (${(subtotal * 0.15).toFixed(2)})
        </Radio>
      </RadioGroup>
    </div>
  );
}
