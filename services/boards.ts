import { requestGraphQL, type GraphQLRequestOptions } from "@/graphql/client";
import {
  CREATE_BOARD,
  CREATE_BOARD_COMMENT,
  DELETE_BOARD,
  DELETE_BOARD_COMMENT,
  DISLIKE_BOARD,
  LIKE_BOARD,
  UPDATE_BOARD,
  UPDATE_BOARD_COMMENT,
} from "@/graphql/mutations";
import { FETCH_BEST_BOARDS, FETCH_BOARD_DETAIL, FETCH_BOARDS } from "@/graphql/queries";
import type { ApiBoard, ApiBoardComment, CreateBoardInput, UpdateBoardInput } from "@/graphql/types";
import type { BoardFormValues } from "@/types/boards";
import {
  createBoardInputFromForm,
  mapBoardComment,
  mapBoardDetail,
  mapBoardForm,
  mapBoardPost,
  normalizeImageUrl,
} from "./mappers";

export type BoardListParams = {
  page?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export async function getBoards(params: BoardListParams = {}, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchBoards: ApiBoard[]; fetchBoardsCount: number }>(
    FETCH_BOARDS,
    params,
    options,
  );
  return { posts: data.fetchBoards.map(mapBoardPost), count: data.fetchBoardsCount };
}

export async function getBestBoards(options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchBoardsOfTheBest: ApiBoard[] }>(
    FETCH_BEST_BOARDS,
    undefined,
    options,
  );
  return data.fetchBoardsOfTheBest.map((board) => ({
    ...mapBoardPost(board),
    image: normalizeImageUrl(board.images?.[0], "/images/트립토크 이미지/01.png"),
    profile: normalizeImageUrl(board.user?.picture, "/images/프로필 이미지/01.png"),
  }));
}

export async function getBoardDetail(boardId: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchBoard: ApiBoard; fetchBoardComments: ApiBoardComment[] }>(
    FETCH_BOARD_DETAIL,
    { boardId, commentPage: 1 },
    options,
  );
  return mapBoardDetail(data.fetchBoard, data.fetchBoardComments);
}

export async function getBoardForm(boardId: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchBoard: ApiBoard; fetchBoardComments: ApiBoardComment[] }>(
    FETCH_BOARD_DETAIL,
    { boardId, commentPage: 1 },
    options,
  );
  return mapBoardForm(data.fetchBoard);
}

export async function createBoard(values: BoardFormValues, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ createBoard: ApiBoard }, { input: CreateBoardInput }>(
    CREATE_BOARD,
    { input: createBoardInputFromForm(values) },
    options,
  );
  return data.createBoard;
}

export async function updateBoard(
  boardId: string,
  values: BoardFormValues,
  options?: GraphQLRequestOptions,
) {
  const { password, ...input } = createBoardInputFromForm(values);
  const data = await requestGraphQL<{ updateBoard: ApiBoard }>(
    UPDATE_BOARD,
    { boardId, input: input as UpdateBoardInput, password },
    options,
  );
  return data.updateBoard;
}

export async function deleteBoard(boardId: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ deleteBoard: string }>(DELETE_BOARD, { boardId }, options);
  return data.deleteBoard;
}

export async function changeBoardReaction(
  boardId: string,
  reaction: "like" | "dislike",
  options?: GraphQLRequestOptions,
) {
  const mutation = reaction === "like" ? LIKE_BOARD : DISLIKE_BOARD;
  const field = reaction === "like" ? "likeBoard" : "dislikeBoard";
  const data = await requestGraphQL<Record<typeof field, number>>(mutation, { boardId }, options);
  return data[field];
}

export async function createBoardComment(
  boardId: string,
  contents: string,
  writer: string,
  password: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ createBoardComment: ApiBoardComment }>(
    CREATE_BOARD_COMMENT,
    { boardId, input: { writer: writer.trim(), password, contents: contents.trim(), rating: 0 } },
    options,
  );
  return mapBoardComment(data.createBoardComment);
}

export async function updateBoardComment(
  boardCommentId: string,
  contents: string,
  password?: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ updateBoardComment: ApiBoardComment }>(
    UPDATE_BOARD_COMMENT,
    { boardCommentId, input: { contents: contents.trim() }, password },
    options,
  );
  return mapBoardComment(data.updateBoardComment);
}

export async function deleteBoardComment(
  boardCommentId: string,
  password?: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ deleteBoardComment: string }>(
    DELETE_BOARD_COMMENT,
    { boardCommentId, password },
    options,
  );
  return data.deleteBoardComment;
}
