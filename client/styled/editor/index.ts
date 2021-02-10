import styled from 'styled-components'

export const Container = styled.div`
  margin: 20px;
  
  .content {
    .line {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;

      label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 50px;
        height: 32px;
        margin-right: 5px;
      }

      input {
        flex: 1;
      }
    }

    .article-title {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      font-size: 30px;
    }
    .article-content {
      background-color: lightgray;
      border-radius: 8px;
      padding: 8px;
    }
  }

  .operate {
      height: 100px;
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
`
