export default{
    get: jest.fn().mockResolvedValue({
        data: { data: { Title: "Test Title"}}
    }),
    post: jest.fn().mockResolvedValue({
        data: {} 
    })
};
