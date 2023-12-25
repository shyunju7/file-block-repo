import { useEffect, useState } from "react";
import { extensions } from "../dummy/extension";
import Checkbox from "./Checkbox";

/**
 * 파일 확장자를 관리할 Form 컴포넌트
 * @returns {JSX.Element} Form 컴포넌트
 */
export default function Form({
	isReadyIndexedDB,
}: {
	isReadyIndexedDB: boolean;
}): JSX.Element {
	const [customValue, setCustomValue] = useState("");

	/**
	 * 커스텀 확장자의 입력처리를 관리하는 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e
	 */
	const onChangeCustomValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setCustomValue(value);
	};

	/**
	 * 커스텀 확장자를 등록하는 함수
	 */
	const addCustomExtension = () => {};

	useEffect(() => {
		if (!isReadyIndexedDB) return;
		console.log("get!!");
	}, [isReadyIndexedDB]);
	return (
		<section className="bg-stone-50 rounded-xl px-4 py-1 mt-4">
			<h2 className="text-lg font-bold text-zinc-700 my-2">고정 확장자</h2>
			<article className="w-full flex mb-6">
				{extensions?.map((extension) => (
					<Checkbox key={extension} name="extension" title={extension} />
				))}
			</article>
			<h2 className="text-lg font-bold text-zinc-700 my-2">고정 확장자</h2>
			<article>
				<input
					type="text"
					value={customValue}
					onChange={onChangeCustomValue}
					placeholder="확장자 입력"
					maxLength={20}
					className="w-full max-w-[320px] border-solid border-2 rounded-xl mr-2 pl-2"
				/>
				<button onClick={addCustomExtension}>추가</button>
			</article>
			<article>
				<label> 3/200</label>
				<div>추가된 확장자 목록</div>
			</article>
		</section>
	);
}
