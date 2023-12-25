import { useEffect, useState } from "react";
import { extensions } from "../dummy/extension";
import Checkbox from "./Checkbox";
import { getDataByProperty, updateData } from "../indexedDB";

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
	const [defaultDataSet, setDefaultDataSet] = useState(extensions);

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

	const getCurrentExtensionData = async () => {
		try {
			const data = (await getDataByProperty(
				"format",
				"category",
				"D"
			)) as ExtensionDataSet;
			setDefaultDataSet(data);
		} catch (e) {
			console.error(e);
		}
	};

	const onChangeCheckboxValue = async (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string
	) => {
		try {
			await updateData("format", id, {
				isChecked: e.target.checked,
			});

			getCurrentExtensionData();
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (!isReadyIndexedDB) return;
		getCurrentExtensionData();
	}, [isReadyIndexedDB]);

	return (
		<section className="bg-stone-50 rounded-xl px-4 py-1 mt-4">
			<h2 className="text-lg font-bold text-zinc-700 my-2">고정 확장자</h2>
			<article className="w-full flex mb-6">
				{defaultDataSet?.map(({ id, name, isChecked }) => (
					<Checkbox
						key={id}
						name="extension"
						title={name}
						isChecked={isChecked}
						onChange={(e) => onChangeCheckboxValue(e, id)}
					/>
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
