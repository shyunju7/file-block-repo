import { extensions } from "../dummy/extension";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

/** Object Stores의 이름 정의 */
export const Stores = {
	FORMAT: "format" as const,
};

/**
 * 기본 더미 데이터를 indexedDB에 추가하는 함수
 * @param {IDBObjectStore} _store
 */
const getDefaultData = (_store: IDBObjectStore) => {
	for (const extension of extensions) {
		_store.add({
			name: extension,
			status: false,
		});
	}
};

/**
 * 데이터베이스를 초기화를 위한 함수
 * @returns {Promise<boolean>} 데이터베이스 생성 성공 여부 반환
 */
export const initDB = (): Promise<boolean> => {
	return new Promise((resolve) => {
		request = indexedDB.open("extension-db", version);

		request.onupgradeneeded = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(Stores.FORMAT)) {
				const _store = db.createObjectStore(Stores.FORMAT, {
					keyPath: "id",
					autoIncrement: true,
				});
				_store.createIndex("status", "status", { unique: false });
				getDefaultData(_store);
			}
		};

		request.onsuccess = (e: Event) => {
			const request = e.target as IDBOpenDBRequest;
			db = request.result;
			version = db.version;
			resolve(true);
		};

		request.onerror = (e) => {
			console.error("[IndexedDB] : onerror()", e);
			resolve(false);
		};
	});
};

/**
 * IndexedDB가 존재하고 유효한 Store인지 검증
 * @param {string} storeName
 * @returns {boolean} IndexedDB 상태
 * */
const isValidStoreName = (storeName: string): boolean =>
	db && db.objectStoreNames.contains(storeName);

/**
 * IndexedDB 특정 store에 데이터를 추가하는 함수
 * @param {string} storeName
 * @param {T} requestObject
 * @returns void
 */
export const addStoreData = <T>(
	storeName: string,
	requestObject: T
): Promise<void> => {
	if (!isValidStoreName(storeName)) {
		return Promise.reject("Invalid store name");
	}

	return new Promise((resolve, reject) => {
		const _store = db
			.transaction(storeName, "readwrite")
			.objectStore(storeName);

		const _addRequest = _store.add(requestObject);

		_addRequest.addEventListener("success", () => {
			console.log("[IndexedDB]: addStoreData()...");
			resolve();
		});

		_addRequest.addEventListener("error", (e) => {
			console.error("[IndexedDB]: addStoreData()...", e);
			reject(e);
		});
	});
};

/**
 * IndexedDB에 저장된 Store의 데이터 1건에 대해 조회하는 함수
 * @param {string} storeName 탐색한 스토어 이름
 * @param {numbeR} targetId 타겟 식별자
 * @returns {T} 결과 데이터
 */
export const getStoreDataById = <T>(
	storeName: string,
	targetId: number
): Promise<T> => {
	if (!isValidStoreName(storeName)) {
		return Promise.reject("Invalid store name");
	}

	return new Promise((resolve, reject) => {
		const _store = db.transaction(storeName, "readonly").objectStore(storeName);
		const _getRequest = _store.get(targetId);

		_getRequest.addEventListener("success", (e: Event) => {
			console.log("[IndexedDB]: getStoreDataById()...");
			const data = e.target as IDBRequest;
			const result = data!.result;
			resolve(result);
		});

		_getRequest.addEventListener("error", (e) => {
			console.error("[IndexedDB]: getStoreDataById()...", e);
			reject(e);
		});
	});
};

/**
 * Object Store에 특정 속성으로 데이터를 조회하는 함수
 * @param {string} storeName 탐색한 스토어 이름
 * @param {string} propertyName 탐색할 속성 이름
 * @param {string} target 탐색할 속성 값
 * @returns
 */
export const getDataByProperty = <T>(
	storeName: string,
	propertyName: string,
	target: string
): Promise<T[]> => {
	if (!isValidStoreName(storeName)) {
		return Promise.reject("Invalid store name");
	}

	return new Promise((resolve, reject) => {
		const _store = db.transaction(storeName, "readonly").objectStore(storeName);

		if (!_store.indexNames.contains(propertyName)) {
			return Promise.reject(`Invalid index name... ${propertyName}`);
		}

		const _index = _store.index(propertyName);
		const _responseData: T[] = [];
		const _requestCursor = _index.openCursor();

		_requestCursor.addEventListener("success", (e: Event) => {
			const data = e.target as IDBRequest;
			const _cursor = data.result;

			if (_cursor) {
				if (_cursor.value[`${propertyName}`] === target) {
					_responseData.push(_cursor.value);
				}
				_cursor.continue();
			} else {
				resolve(_responseData);
			}
			console.log(`[IndexedDB]: getStoreDataBy${propertyName}()...`);
		});

		_requestCursor.addEventListener("error", (e) => {
			console.log(`[IndexedDB]: getStoreDataBy${propertyName}()...`);
			reject(e);
		});
	});
};