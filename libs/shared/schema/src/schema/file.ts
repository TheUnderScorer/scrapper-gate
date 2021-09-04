import gql from 'graphql-tag';

export const fileSchema = gql`
  type File implements BaseEntity {
    id: ID!
    createdAt: Date!
    deletedAt: Date
    updatedAt: Date!
    key: String!
    name: String!
    mimeType: String!
    type: FileType!
    kind: FileKind!
    access: FileAccess!
    url: Url
  }

  enum FileAccess {
    Public
    Private
  }

  enum FileKind {
    Image
    Video
    Document
    Other
  }

  enum FileType {
    ScrapperScreenshot
  }
`;
