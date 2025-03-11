export default function Input({fieldName}){
    return (
      <div>
        <label htmlFor={fieldName}></label>
        <input
          name={fieldName}
          type="text"
          placeholder={`Enter ${fieldName}`}
          className="w-full py-[9px] px-1.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-500
                        focus:border-blue-600"
        />
      </div>
    );
}