import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Products {
    products {
        id
        productName
        price
        description
    }
}
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(productInput: $input) {
        id
        productName
        price
        description
    }
}
`