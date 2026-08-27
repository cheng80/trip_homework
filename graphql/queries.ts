export const FETCH_BOARDS = `
  query FetchBoards($page: Int, $search: String, $startDate: DateTime, $endDate: DateTime) {
    fetchBoards(page: $page, search: $search, startDate: $startDate, endDate: $endDate) {
      _id writer title contents likeCount dislikeCount images createdAt
      boardAddress { zipcode address addressDetail }
      user { _id email name picture }
    }
    fetchBoardsCount(search: $search, startDate: $startDate, endDate: $endDate)
  }
`;

export const FETCH_BEST_BOARDS = `
  query FetchBestBoards {
    fetchBoardsOfTheBest {
      _id writer title contents likeCount dislikeCount images createdAt
      boardAddress { zipcode address addressDetail }
      user { _id email name picture }
    }
  }
`;

export const FETCH_BOARD_DETAIL = `
  query FetchBoardDetail($boardId: ID!, $commentPage: Int) {
    fetchBoard(boardId: $boardId) {
      _id writer title contents youtubeUrl likeCount dislikeCount images createdAt updatedAt
      boardAddress { zipcode address addressDetail }
      user { _id email name picture }
    }
    fetchBoardComments(boardId: $boardId, page: $commentPage) {
      _id writer contents rating createdAt
      user { _id email name picture }
    }
  }
`;

export const FETCH_TRAVELPRODUCTS = `
  query FetchTravelproducts($page: Int, $search: String, $isSoldout: Boolean) {
    fetchTravelproducts(page: $page, search: $search, isSoldout: $isSoldout) {
      _id name remarks contents price tags images pickedCount soldAt createdAt
      travelproductAddress { zipcode address addressDetail lat lng }
      buyer { _id email name picture }
      seller { _id email name picture }
    }
  }
`;

export const FETCH_BEST_TRAVELPRODUCTS = `
  query FetchBestTravelproducts {
    fetchTravelproductsOfTheBest {
      _id name remarks contents price tags images pickedCount soldAt createdAt
      travelproductAddress { zipcode address addressDetail lat lng }
      seller { _id email name picture }
    }
  }
`;

export const FETCH_TRAVELPRODUCT_DETAIL = `
  query FetchTravelproductDetail($travelproductId: ID!, $questionPage: Int) {
    fetchTravelproduct(travelproductId: $travelproductId) {
      _id name remarks contents price tags images pickedCount soldAt createdAt updatedAt
      travelproductAddress { zipcode address addressDetail lat lng }
      buyer { _id email name picture }
      seller { _id email name picture }
    }
    fetchTravelproductQuestions(travelproductId: $travelproductId, page: $questionPage) {
      _id contents createdAt
      user { _id email name picture }
    }
  }
`;

export const FETCH_TRAVELPRODUCT_QUESTION_ANSWERS = `
  query FetchTravelproductQuestionAnswers($questionId: ID!, $page: Int) {
    fetchTravelproductQuestionAnswers(travelproductQuestionId: $questionId, page: $page) {
      _id contents createdAt
      user { _id email name picture }
    }
  }
`;

export const FETCH_USER_LOGGED_IN = `
  query FetchUserLoggedIn {
    fetchUserLoggedIn {
      _id email name picture
      userPoint { amount }
    }
  }
`;

export const FETCH_MYPAGE = `
  query FetchMypage($page: Int, $search: String) {
    fetchUserLoggedIn {
      _id email name picture
      userPoint { amount }
    }
    fetchTravelproductsIBought(page: $page, search: $search) {
      _id name remarks contents price tags images pickedCount soldAt createdAt
      travelproductAddress { address addressDetail }
      seller { _id email name picture }
    }
    fetchTravelproductsISold(page: $page, search: $search) {
      _id name remarks contents price tags images pickedCount soldAt createdAt
      travelproductAddress { address addressDetail }
      seller { _id email name picture }
    }
    fetchTravelproductsIPicked(page: $page, search: $search) {
      _id name remarks contents price tags images pickedCount soldAt createdAt
      travelproductAddress { address addressDetail }
      seller { _id email name picture }
    }
    fetchPointTransactions(page: $page, search: $search) {
      _id amount balance status statusDetail createdAt
      travelproduct { _id name }
    }
  }
`;
