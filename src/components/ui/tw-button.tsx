interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

export default function Button({ name, onClick }: IButtonProps) {
  return (
    <button
      className="min-w-20 rounded-xl border border-gray-700 p-2"
      onClick={onClick}
    >
      {name}
    </button>
  );
}
