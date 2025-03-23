export default function ErrorMessage({ fieldName, errors }) {
    if (!errors || !errors[fieldName]) return null;
    
    return (
      <div className="text-red-500 text-xs mt-1">
        {Array.isArray(errors[fieldName]) 
          ? errors[fieldName].map((err, idx) => <p key={idx}>{err}</p>)
          : <p>{errors[fieldName]}</p>}
      </div>
    );
  }