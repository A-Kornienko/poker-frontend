import React from "react";
import MyModal from "../Ui/MyModal";
import MyButton from "../UI/MyButton";

interface RebuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRebuy: (chips: number) => void;
  initialStack?: number;
  isLoading: boolean;
}

const RebuyModal: React.FC<RebuyModalProps> = ({
  isOpen,
  onClose,
  onRebuy,
  initialStack = 50,
  isLoading,
}) => {
  const [chips, setСhips] = React.useState(initialStack);

  React.useEffect(() => {
    if (isOpen) setСhips(initialStack);
  }, [isOpen, initialStack]);

  const handleRebuy = () => {
    onRebuy(chips);
  };

  return (
    <MyModal isOpen={isOpen} onClose={onClose} title="Rebuy Chips">
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-green-400 font-bold text-3xl">${chips}</span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={chips}
          onChange={(e) => setСhips(Number(e.target.value))}
          className="w-full h-4 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${
              ((chips - 10) / 90) * 100
            }%, #3f3f46 ${((chips - 10) / 90) * 100}%, #3f3f46 100%)`,
          }}
        />

        <div className="flex justify-between text-gray-400 text-sm">
          <span>$10</span>
          <span>$100</span>
        </div>

        <div className="flex gap-4 justify-center pt-4">
            
          <MyButton
            onClick={handleRebuy}
            disabled={isLoading} 
          >
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <p className="text-green-500">Rebuy</p>
            )}
          </MyButton>
          <MyButton
            onClick={onClose}
            disabled={isLoading} 
          >
            <p className="text-red-500">Close</p>
          </MyButton>
        </div>
      </div>
    </MyModal>
  );
};

export default RebuyModal;