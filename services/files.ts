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

export async function uploadImageFiles(files: File[], options?: GraphQLRequestOptions) {
  validateImageFiles(files);
  return Promise.all(files.map(async (file) => (await uploadFile(file, options)).url));
}
