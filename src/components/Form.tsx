import { useEffect, useState } from "react";
import { extensions } from "../dummy/extension";
import Checkbox from "./Checkbox";
import {
	addStoreData,
	deleteStoreData,
	getDataByProperty,
	getStoreDataById,
	updateData,
} from "../indexedDB";
import Tag from "./Tag";

/** 고정 확장자 및 커스텀 확장자 데이터 셋 타입 */
type DataSet = {
	default: ExtensionDataSet;
	custom: ExtensionDataSet;
};

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
	const [dataSet, setDataSet] = useState<DataSet>({
		default: extensions,
		custom: [],
	});

	/**
	 * 커스텀 확장자의 입력처리를 관리하는 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e
	 */
	const onChangeCustomValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setCustomValue(value);
	};

	/**
	 * 이미 존재하는지 파일 여부를 확인하는 함수
	 * @param value
	 * @returns
	 */
	const isExistName = async (value: string) => {
		try {
			const data = await getStoreDataById("format", value);
			if (!data) return false;
		} catch (e) {
			console.log(e);
		}
		return true;
	};

	/**
	 * 커스텀 확장자를 등록하는 함수
	 * 등록 가능 조건에 따른 처리
	 * 1) 최대 등록 횟수 200회 미만
	 * 2) 확장자는 영문 소문자만 등록
	 * 3) 이미 존재하는 확장자인지 여부 판단
	 */
	const addCustomExtension = async () => {
		if (dataSet.custom.length === 200) {
			alert("최대 추가 횟수를 초과하였습니다.");
			return;
		}

		if (!/^[a-z]+$/.test(customValue)) {
			alert("영문 소문자만 가능합니다.");
			return;
		}

		if (await isExistName(customValue)) {
			alert("이미 존재하는 확장자입니다.");
			return;
		}

		try {
			const _data = {
				id: customValue,
				name: customValue,
				isChecked: true,
				category: "C",
			};

			await addStoreData("format", _data);
			setCustomValue("");
			getDataSet();
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * 고정 확장자 목록 조회 함수
	 */
	const getDataSet = async () => {
		try {
			const _default = (await getDataByProperty(
				"format",
				"category",
				"D"
			)) as ExtensionDataSet;
			const _custom = (await getDataByProperty(
				"format",
				"category",
				"C"
			)) as ExtensionDataSet;
			setDataSet({
				default: _default,
				custom: _custom,
			});
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * 고정 확장자 목록 변경을 감지하는 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e
	 * @param {string} id
	 */
	const onChangeCheckboxValue = async (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string
	) => {
		try {
			await updateData("format", id, {
				isChecked: e.target.checked,
			});

			getDataSet();
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * 커스텀 확장자를 삭제하는 함수
	 */
	const deleteCustomExtension = (id: string) => {
		deleteStoreData("format", id);
		getDataSet();
	};

	/** indexedDB가 준비되면 데이터를 호출 */
	useEffect(() => {
		if (!isReadyIndexedDB) return;
		getDataSet();
	}, [isReadyIndexedDB]);

	return (
		<section className="bg-stone-50 rounded-xl px-4 py-1 mt-4">
			<h2 className="text-lg font-bold text-zinc-700 my-2">고정 확장자</h2>
			<article className="w-full flex mb-6">
				{dataSet.default.map(({ id, name, isChecked }) => (
					<Checkbox
						key={id}
						name="extension"
						title={name}
						isChecked={isChecked}
						onChange={(e) => onChangeCheckboxValue(e, id)}
					/>
				))}
			</article>
			<h2 className="text-lg font-bold text-zinc-700 my-2">커스텀 확장자</h2>
			<article>
				<input
					type="text"
					value={customValue}
					onChange={onChangeCustomValue}
					placeholder="확장자 입력"
					maxLength={20}
					className="w-full max-w-[320px] border-solid border rounded-lg mr-1 pl-2 py-1"
				/>
				<button
					onClick={addCustomExtension}
					className="w-[64px] h-[32px] bg-blue-500 rounded-lg text-white text-md"
				>
					추가
				</button>
			</article>
			<article className="mt-3">
				<label className="text-sm text-zinc-400 ml-2">
					{dataSet.custom.length}/200
				</label>
				<div className="w-full max-w-[600px]">
					{dataSet.custom.map(({ id, name }) => (
						<Tag
							key={id}
							name={name}
							onDelete={() => deleteCustomExtension(id)}
						/>
					))}
				</div>
			</article>
		</section>
	);
}
