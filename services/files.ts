/**
 * 역할: GraphQL multipart 업로드와 여러 이미지 업로드 순서를 제공하는 서비스입니다.
 * 처리 흐름: 각 파일을 검증한 뒤 업로드하고 서버 URL을 정규화해 폼 mutation에 사용할 배열로 반환합니다.
 * 주의사항: 일반 Apollo HttpLink가 지원하지 않는 multipart 요청은 전용 전송 함수를 사용합니다.
 */
import { uploadGraphQLFile, type GraphQLRequestOptions } from "@/graphql/client";
import { UPLOAD_FILE } from "@/graphql/mutations";
import { validateImageFiles } from "./file-validation";

export async function uploadFile(file: File, options?: GraphQLRequestOptions) {
  const data = await uploadGraphQLFile<{ uploadFile: { _id: string; url: string; size: number } }>(
    UPLOAD_FILE,
    file,
    file.name,
    options,
  );
  return data.uploadFile;
}

export async function uploadImageFiles(files: File[], options?: GraphQLRequestOptions, existingCount = 0) {
  validateImageFiles(files, existingCount);
  return Promise.all(files.map(async (file) => (await uploadFile(file, options)).url));
}
