import {  getByTestId, queryByTestId, render } from '@testing-library/react';
import Article from './Article';

//Article Tests
test("Verdict Renders and Loads", () => {
    const { queryByTestId } = render(<Article title="testTitle" probability="testLoading" body="testBody" url="testUrl"/>);

    const title = queryByTestId("title");
    expect(queryByTestId("title")).toBeTruthy();
    expect(title.innerHTML).toBe("testTitle");

    const predictionAndProbability = queryByTestId("predictionAndProbability");
    expect(queryByTestId("predictionAndProbability")).toBeTruthy();
    expect(predictionAndProbability.innerHTML).toBe(" testLoading");


    const body = queryByTestId("body");
    expect(queryByTestId("body")).toBeTruthy();
    expect(body.innerHTML).toBe("testBody");

    const url = queryByTestId("url");
    expect(queryByTestId("url")).toBeTruthy();
    expect(url.getAttribute("href")).toBe("testUrl");
});

test("Article Renders Probability", () => {
    const { queryByTestId } = render(<Article title="testTitle" prediction="true" probability="0.923" body="testBody" url="testUrl"/>);

    const title = queryByTestId("title");
    expect(queryByTestId("title")).toBeTruthy();
    expect(title.innerHTML).toBe("testTitle");

    const predictionAndProbability = queryByTestId("predictionAndProbability");
    expect(queryByTestId("predictionAndProbability")).toBeTruthy();
    expect(predictionAndProbability.innerHTML).toBe("true 92%");

    const body = queryByTestId("body");
    expect(queryByTestId("body")).toBeTruthy();
    expect(body.innerHTML).toBe("testBody");

    const url = queryByTestId("url");
    expect(queryByTestId("url")).toBeTruthy();
    expect(url.getAttribute("href")).toBe("testUrl");
});