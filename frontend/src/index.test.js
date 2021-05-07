import { fireEvent, getByTestId, queryByTestId, render, screen, waitForElement } from '@testing-library/react';
import UrlForm, { ManualForm } from './index.js';
import {InputtedForm, Verdict} from './index.js';
import axiosMock from "./__mocks__/axios"

//UrkForm Tests
test("UrlForm Renders", () => {
    const { queryByTestId } = render(<UrlForm />);
    
    const urlInput = queryByTestId("urlInput");
    expect(urlInput).toBeTruthy();
});

describe("UrlForm Input shows and posts", () =>{
    test("on change", () => {
        axiosMock.post.mockResolvedValueOnce({ data: { Title: "Test Title"}})

        const { queryByTestId } = render(<UrlForm />);

        const urlInput = queryByTestId("urlInput");
        fireEvent.change(urlInput, {target: { value: "testValue" }});
        expect(urlInput.value).toBe("testValue");

        const btn = queryByTestId("subButUrl");
        fireEvent.click(btn);

        const resolvedGather = waitForElement(() => queryByTestId("gathered"));
        expect(resolvedGather).toBeTruthy();
    });
});

//InputtedForm Tests
test("InputtedForm Renders", () => {
    const { queryByTestId } = render(<InputtedForm />);

    const titleInput = queryByTestId("titleInput");
    expect(queryByTestId("titleInput")).toBeTruthy();

    const bodyTextArea = queryByTestId("bodyTextArea");
    expect(queryByTestId("bodyTextArea")).toBeTruthy();
});

test("InputtedForm inputs show and posts", () => {
    axiosMock.post.mockResolvedValueOnce({ data: { Title: "Test Title"}})

    const { queryByTestId } = render(<InputtedForm />);

    const titleInput = queryByTestId("titleInput");
    fireEvent.change(titleInput, {target: { value: "testValue" }});
    expect(titleInput.value).toBe("testValue");

    const bodyArea = queryByTestId("bodyTextArea");
    fireEvent.change(bodyArea, {target: { value: "testArea" }});
    expect(bodyArea.value).toBe("testArea");

    const btn = queryByTestId("subButInp");
    fireEvent.click(btn);

    const resolvedVerdict = waitForElement(() => queryByTestId("verdict"));
    expect(resolvedVerdict).toBeTruthy();
});

test("InputtedForm puts gathered information in inputs", () => {
    const { queryByTestId } = render(<InputtedForm title="testTitle" body="testBody" />);

    const titleInput = queryByTestId("titleInput");
    expect(titleInput.value).toBe("testTitle");

    const bodyArea = queryByTestId("bodyTextArea");
    expect(bodyArea.value).toBe("testBody");
});

//ManualForm Tests
test("ManualForm Renders", () => {
    const { queryByTestId } = render(<ManualForm />);

    const titleInput = queryByTestId("titleInput");
    expect(queryByTestId("titleInput")).toBeTruthy();

    const bodyTextArea = queryByTestId("bodyTextArea");
    expect(queryByTestId("bodyTextArea")).toBeTruthy();
});

test("ManualForm inputs show and posts", () => {
    axiosMock.post.mockResolvedValueOnce({ data: { Title: "Test Title"}})

    const { queryByTestId } = render(<ManualForm />);

    const titleInput = queryByTestId("titleInput");
    fireEvent.change(titleInput, {target: { value: "testValue" }});
    expect(titleInput.value).toBe("testValue");

    const bodyArea = queryByTestId("bodyTextArea");
    fireEvent.change(bodyArea, {target: { value: "testArea" }});
    expect(bodyArea.value).toBe("testArea");

    const btn = queryByTestId("subButMan");
    fireEvent.click(btn);

    const resolvedVerdict = waitForElement(() => getByTestId("verdict"));
    expect(resolvedVerdict).toBeTruthy();
});

//Verdict Tests
test("Verdict Renders and Loads", () => {
    const { queryByTestId } = render(<Verdict title="testTitle" probability="testLoading" body="testBody" />);

    const title = queryByTestId("title");
    expect(queryByTestId("title")).toBeTruthy();
    expect(title.innerHTML).toBe("testTitle");

    const predictionAndProbability = queryByTestId("predictionAndProbability");
    expect(queryByTestId("predictionAndProbability")).toBeTruthy();
    expect(predictionAndProbability.innerHTML).toBe(" testLoading");


    const body = queryByTestId("body");
    expect(queryByTestId("body")).toBeTruthy();
    expect(body.innerHTML).toBe("testBody");
});

test("Verdict Renders Probability", () => {
    const { queryByTestId } = render(<Verdict title="testTitle" prediction="true" probability="0.923" body="testBody" />);

    const title = queryByTestId("title");
    expect(queryByTestId("title")).toBeTruthy();
    expect(title.innerHTML).toBe("testTitle");

    const predictionAndProbability = queryByTestId("predictionAndProbability");
    expect(queryByTestId("predictionAndProbability")).toBeTruthy();
    expect(predictionAndProbability.innerHTML).toBe("true 92%");


    const body = queryByTestId("body");
    expect(queryByTestId("body")).toBeTruthy();
    expect(body.innerHTML).toBe("testBody");
});