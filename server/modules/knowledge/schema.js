module.exports = {
    query: `
        knowledge(page: Int, pageSize: Int): Knowledges
        knowledgeGet(id: Int): Knowledge
        knowledgeSearch(page: Int, pageSize: Int, data: KnowledgeSearchInput): Knowledges
    `,
    mutation: `
        knowledgeAdd(data: KnowledgeAddInput): Int
        knowledgeBatchAdd(datas: [KnowledgeAddInput]): Int
        knowledgeUpdate(id: Int, data: KnowledgeAddInput): Boolean
        knowledgeDelete(id: Int): Boolean
        knowledgeBatchDelete(ids: [Int]): Boolean
    `,
    subscription: ``,
    type: `
        type Knowledge {
            id: Int
            name: String
        }

        type Knowledges {
            totalCounts: Int
            items: [Knowledge]
        }

        input KnowledgeAddInput {
            name: String
        }

        input KnowledgeSearchInput {
            name: String
        }
    `
} 