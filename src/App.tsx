import Form from "./components/Form";

/**
 * 애플리케이션 진입점 페이지
 * @returns {JSX.Element} App 컴포넌트
 */
function App(): JSX.Element {
	return (
		<main className="w-full min-w-[600px] h-screen pt-8">
			<h1 className="w-full text-center text-xl font-bold text-zinc-700">
				파일 확장자 차단
			</h1>
			<Form />
		</main>
	);
}

export default App;
