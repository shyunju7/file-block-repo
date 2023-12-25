/** Tag 컴포넌트 props 타입 정의 */
interface TagProps {
	name: string;
	onDelete: () => void;
}

/**
 * 커스텀 확장자를 표현할 Tag 컴포넌트
 * @param {TagProps} props - name {string}, onDelete{() => void}
 * @returns {JSX.Element} Tag 컴포넌트
 */
export default function Tag({ name, onDelete }: TagProps): JSX.Element {
	return (
		<div className="inline-block border-solid border bg-white rounded-2xl px-2 m-1">
			<label className="text-md">{name}</label>
			<img
				src="/assets/images/ic-delete.svg"
				width={11}
				alt="삭제 아이콘"
				className="inline ml-2 cursor-pointer mb-1"
				onClick={onDelete}
			/>
		</div>
	);
}
