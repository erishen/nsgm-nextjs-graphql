module.exports = {
    query: `
        knowledge(page: Int, pageSize: Int): Knowledges
        knowledgeGet(id: Int): Knowledge
        knowledgeSearch(page: Int, pageSize: Int, data: KnowledgeSearchInput): Knowledges
    `,
    mutation: `
        knowledgeAdd(data: KnowledgeAddInput): Int
        knowledgeUpdate(id: Int, data: KnowledgeAddInput): Boolean
        knowledgeDelete(id: Int): Boolean
    `,
    subscription: ``,
    type: `
        type Knowledge {
            id: Int
            name: String
            content: String
        }

        type Knowledges {
            totalCounts: Int
            items: [Knowledge]
        }

        input KnowledgeAddInput {
            name: String
            content: String
        }

        input KnowledgeSearchInput {
            name: String
        }
    `
} 