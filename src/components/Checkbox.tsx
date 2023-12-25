/** Checkbox 컴포넌트 props 인터페이스 정의 */
interface CheckboxProps {
	name: string;
	title: string;
	isChecked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 체크박스 컴포넌트
 * @param {CheckboxProps} props - name{string}, title{string}
 * @returns {JSX.Element}
 */
export default function Checkbox({
	name,
	title,
	isChecked,
	onChange,
}: CheckboxProps): JSX.Element {
	return (
		<div className="flex w-full gap-2">
			<input
				type="checkbox"
				id={`extension-${title}`}
				name={name}
				onChange={(e) => onChange(e)}
				checked={isChecked}
			/>
			<label htmlFor={`extension-${title}`} className="text-zinc-700">
				{title}
			</label>
		</div>
	);
}
