import { requestGraphQL, type GraphQLRequestOptions } from "@/graphql/client";
import {
  BUY_TRAVELPRODUCT,
  CREATE_TRAVELPRODUCT,
  CREATE_TRAVELPRODUCT_QUESTION,
  CREATE_TRAVELPRODUCT_QUESTION_ANSWER,
  DELETE_TRAVELPRODUCT,
  DELETE_TRAVELPRODUCT_QUESTION,
  DELETE_TRAVELPRODUCT_QUESTION_ANSWER,
  TOGGLE_TRAVELPRODUCT_PICK,
  UPDATE_TRAVELPRODUCT,
  UPDATE_TRAVELPRODUCT_QUESTION,
  UPDATE_TRAVELPRODUCT_QUESTION_ANSWER,
} from "@/graphql/mutations";
import {
  FETCH_BEST_TRAVELPRODUCTS,
  FETCH_TRAVELPRODUCT_DETAIL,
  FETCH_TRAVELPRODUCTS,
} from "@/graphql/queries";
import type {
  ApiTravelproduct,
  ApiTravelproductQuestion,
  ApiTravelproductQuestionAnswer,
  CreateTravelproductInput,
  UpdateTravelproductInput,
} from "@/graphql/types";
import type { TravelProductFormValues } from "@/types/travel-products";
import {
  createTravelproductInputFromForm,
  mapTravelInquiry,
  mapTravelProduct,
  mapTravelProductDetail,
} from "./mappers";

export type TravelproductListParams = { page?: number; search?: string; isSoldout?: boolean };

export async function getTravelproducts(
  params: TravelproductListParams = {},
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ fetchTravelproducts: ApiTravelproduct[] }>(
    FETCH_TRAVELPRODUCTS,
    params,
    options,
  );
  return data.fetchTravelproducts.map(mapTravelProduct);
}

export async function getBestTravelproducts(options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchTravelproductsOfTheBest: ApiTravelproduct[] }>(
    FETCH_BEST_TRAVELPRODUCTS,
    undefined,
    options,
  );
  return data.fetchTravelproductsOfTheBest.map(mapTravelProduct);
}

export async function getTravelproductDetail(id: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{
    fetchTravelproduct: ApiTravelproduct;
    fetchTravelproductQuestions: ApiTravelproductQuestion[];
  }>(FETCH_TRAVELPRODUCT_DETAIL, { travelproductId: id, questionPage: 1 }, options);
  return mapTravelProductDetail(data.fetchTravelproduct, data.fetchTravelproductQuestions);
}

export async function createTravelproduct(
  values: TravelProductFormValues,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<
    { createTravelproduct: ApiTravelproduct },
    { input: CreateTravelproductInput }
  >(CREATE_TRAVELPRODUCT, { input: createTravelproductInputFromForm(values) }, options);
  return mapTravelProduct(data.createTravelproduct);
}

export async function updateTravelproduct(
  id: string,
  values: TravelProductFormValues,
  options?: GraphQLRequestOptions,
) {
  const input: UpdateTravelproductInput = createTravelproductInputFromForm(values);
  const data = await requestGraphQL<{ updateTravelproduct: ApiTravelproduct }>(
    UPDATE_TRAVELPRODUCT,
    { travelproductId: id, input },
    options,
  );
  return mapTravelProduct(data.updateTravelproduct);
}

export async function deleteTravelproduct(id: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ deleteTravelproduct: string }>(
    DELETE_TRAVELPRODUCT,
    { travelproductId: id },
    options,
  );
  return data.deleteTravelproduct;
}

export async function toggleTravelproductPick(id: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ toggleTravelproductPick: number }>(
    TOGGLE_TRAVELPRODUCT_PICK,
    { travelproductId: id },
    options,
  );
  return data.toggleTravelproductPick;
}

export async function buyTravelproduct(id: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ createPointTransactionOfBuyingAndSelling: ApiTravelproduct }>(
    BUY_TRAVELPRODUCT,
    { travelproductId: id },
    options,
  );
  return mapTravelProduct(data.createPointTransactionOfBuyingAndSelling);
}

export async function createTravelproductQuestion(
  id: string,
  contents: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ createTravelproductQuestion: ApiTravelproductQuestion }>(
    CREATE_TRAVELPRODUCT_QUESTION,
    { travelproductId: id, contents: contents.trim() },
    options,
  );
  return mapTravelInquiry(data.createTravelproductQuestion);
}

export async function updateTravelproductQuestion(
  questionId: string,
  contents: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ updateTravelproductQuestion: ApiTravelproductQuestion }>(
    UPDATE_TRAVELPRODUCT_QUESTION,
    { questionId, contents: contents.trim() },
    options,
  );
  return mapTravelInquiry(data.updateTravelproductQuestion);
}

export async function deleteTravelproductQuestion(questionId: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ deleteTravelproductQuestion: string }>(
    DELETE_TRAVELPRODUCT_QUESTION,
    { questionId },
    options,
  );
  return data.deleteTravelproductQuestion;
}

export async function createTravelproductQuestionAnswer(
  questionId: string,
  contents: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ createTravelproductQuestionAnswer: ApiTravelproductQuestionAnswer }>(
    CREATE_TRAVELPRODUCT_QUESTION_ANSWER,
    { questionId, contents: contents.trim() },
    options,
  );
  return data.createTravelproductQuestionAnswer;
}

export async function updateTravelproductQuestionAnswer(
  answerId: string,
  contents: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ updateTravelproductQuestionAnswer: ApiTravelproductQuestionAnswer }>(
    UPDATE_TRAVELPRODUCT_QUESTION_ANSWER,
    { answerId, contents: contents.trim() },
    options,
  );
  return data.updateTravelproductQuestionAnswer;
}

export async function deleteTravelproductQuestionAnswer(
  answerId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await requestGraphQL<{ deleteTravelproductQuestionAnswer: string }>(
    DELETE_TRAVELPRODUCT_QUESTION_ANSWER,
    { answerId },
    options,
  );
  return data.deleteTravelproductQuestionAnswer;
}
