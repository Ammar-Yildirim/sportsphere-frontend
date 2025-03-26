import { ImSpinner2 } from "react-icons/im";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <ImSpinner2 className="animate-spin text-blue-500" size={48} />
    </div>
  );
}
