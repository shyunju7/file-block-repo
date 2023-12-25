/** Checkbox 컴포넌트 props 인터페이스 정의 */
interface CheckboxProps {
	name: string;
	title: string;
}

/**
 * 체크박스 컴포넌트
 * @param {CheckboxProps} props - name{string}, title{string}
 * @returns {JSX.Element}
 */
export default function Checkbox({ name, title }: CheckboxProps): JSX.Element {
	return (
		<div className="flex w-full bg-red-300 gap-2">
			<input type="checkbox" id={`extension-${title}`} name={name} />
			<label htmlFor={`extension-${title}`}>{title}</label>
		</div>
	);
}
