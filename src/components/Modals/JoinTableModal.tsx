import React from "react";
import MyModal from "../Ui/MyModal";
import MyButton from "../UI/MyButton";

interface JoinTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (stack: number) => void;
  initialStack?: number;
}

const JoinTableModal: React.FC<JoinTableModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  initialStack = 50,
}) => {
  const [stack, setStack] = React.useState(initialStack);

  React.useEffect(() => {
    if (isOpen) setStack(initialStack);
  }, [isOpen, initialStack]);

  const handleJoin = () => {
    onJoin(stack);
    onClose();
  };

  return (
    <MyModal isOpen={isOpen} onClose={onClose} title="Choose a stack">
      <div className="space-y-6">
        <div className="text-center">
          {/* <span className="text-gray-300 text-lg">Стек: </span> */}
          <span className="text-green-400 font-bold text-3xl">${stack}</span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={stack}
          onChange={(e) => setStack(Number(e.target.value))}
          className="w-full h-4 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${
              ((stack - 10) / 90) * 100
            }%, #3f3f46 ${((stack - 10) / 90) * 100}%, #3f3f46 100%)`,
          }}
        />

        <div className="flex justify-between text-gray-400 text-sm">
          <span>$10</span>
          <span>$100</span>
        </div>

        <div className="flex gap-4 justify-center pt-4">
            
          <MyButton
            onClick={handleJoin}
          >
            <p className="text-green-500">Join</p>
          </MyButton>
          <MyButton
            onClick={onClose}
          >
            <p className="text-red-500">Close</p>
          </MyButton>
        </div>
      </div>
    </MyModal>
  );
};

export default JoinTableModal;