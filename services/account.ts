import { requestGraphQL, type GraphQLRequestOptions } from "@/graphql/client";
import {
  CREATE_USER,
  LOAD_POINT,
  LOGIN_USER,
  LOGOUT_USER,
  RESET_USER_PASSWORD,
  RESTORE_ACCESS_TOKEN,
} from "@/graphql/mutations";
import { FETCH_MYPAGE, FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { ApiPointTransaction, ApiTravelproduct, ApiUser } from "@/graphql/types";
import type { MypageData } from "@/types/mypage";
import { mapMypageMember, mapMypageProduct, mapPointTransaction } from "./mappers";

export type SignupInput = { email: string; password: string; name: string };

export async function signup(input: SignupInput, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ createUser: ApiUser }>(CREATE_USER, { input }, options);
  return mapMypageMember(data.createUser);
}

export async function login(email: string, password: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ loginUser: { accessToken: string } }>(
    LOGIN_USER,
    { email: email.trim(), password },
    options,
  );
  return data.loginUser.accessToken;
}

export async function logout(options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ logoutUser: boolean }>(LOGOUT_USER, undefined, options);
  return data.logoutUser;
}

export async function restoreAccessToken(options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ restoreAccessToken: { accessToken: string } }>(
    RESTORE_ACCESS_TOKEN,
    undefined,
    options,
  );
  return data.restoreAccessToken.accessToken;
}

export async function resetPassword(password: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ resetUserPassword: boolean }>(
    RESET_USER_PASSWORD,
    { password },
    options,
  );
  return data.resetUserPassword;
}

export async function getLoggedInUser(options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ fetchUserLoggedIn: ApiUser }>(
    FETCH_USER_LOGGED_IN,
    undefined,
    options,
  );
  return mapMypageMember(data.fetchUserLoggedIn);
}

export async function getMypage(options?: GraphQLRequestOptions): Promise<MypageData> {
  const data = await requestGraphQL<{
    fetchUserLoggedIn: ApiUser;
    fetchTravelproductsIBought: ApiTravelproduct[];
    fetchTravelproductsISold: ApiTravelproduct[];
    fetchTravelproductsIPicked: ApiTravelproduct[];
    fetchPointTransactions: ApiPointTransaction[];
  }>(FETCH_MYPAGE, { page: 1, search: "" }, options);

  return {
    member: mapMypageMember(data.fetchUserLoggedIn),
    transactions: [
      ...data.fetchTravelproductsIBought.map((product) => mapMypageProduct(product, "구매 완료")),
      ...data.fetchTravelproductsISold.map((product) => (
        mapMypageProduct(product, product.soldAt ? "판매 완료" : "판매 중")
      )),
    ],
    bookmarks: data.fetchTravelproductsIPicked.map((product) => mapMypageProduct(product, "북마크")),
    pointHistory: data.fetchPointTransactions.map(mapPointTransaction),
  };
}

export async function loadPoint(paymentId: string, options?: GraphQLRequestOptions) {
  const data = await requestGraphQL<{ createPointTransactionOfLoading: ApiPointTransaction }>(
    LOAD_POINT,
    { paymentId },
    options,
  );
  return mapPointTransaction(data.createPointTransactionOfLoading);
}
