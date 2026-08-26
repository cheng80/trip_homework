import { uploadGraphQLFile, type GraphQLRequestOptions } from "@/graphql/client";
import { UPLOAD_FILE } from "@/graphql/mutations";

export async function uploadFile(file: File, options?: GraphQLRequestOptions) {
  const data = await uploadGraphQLFile<{ uploadFile: { _id: string; url: string; size: number } }>(
    UPLOAD_FILE,
    file,
    file.name,
    options,
  );
  return data.uploadFile;
}
