import {  getByTestId, queryByTestId, render, waitForElement } from '@testing-library/react';
import ArticleController from './ArticleController';
import axiosMock from "c:/Users/Bertram Su/Desktop/srproj/NewsNeuralizer/frontend/src/__mocks__/axios"

//ArticleController Test
test("ArticleController gets", () => {
    axiosMock.get.mockResolvedValueOnce({ data: { Title: "Test Title"}})

    const { queryByTestId } = render(<ArticleController />);

    const feedLoading = queryByTestId("feedLoading");
    expect(feedLoading).toBeTruthy();

    const resolvedVerdict = waitForElement(() => queryByTestId("feedLoaded"));
    expect(resolvedVerdict).toBeTruthy();
});