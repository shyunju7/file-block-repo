/// <reference types="vite/client" />

type ExtensionData = {
	id: string;
	name: string;
	isChecked: boolean;
	category: "D" | "C";
};

type ExtensionDataSet = ExtensionData[];
