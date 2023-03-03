import Link from 'next/link'

const BitBucketPipelinesSeriesHeader = () => {
  return (
    <>
      <h2>Series</h2>
      <ul>
        <li>
          <Link href="/blog/bit-bucket-pipelines/part-one-building-and-testing-aspnet-core">
            Part 1: Building and Testing ASP.NET Core
          </Link>
        </li>
        <li>
          <Link href="/blog/bit-bucket-pipelines/part-two-deploying-aspnet-core-to-azure">
            Part 2: Deploying ASP.NET Core to Azure Web App
          </Link>
        </li>
        <li>
          <Link href="/blog/bit-bucket-pipelines/part-three-deploying-static-site-to-azure">
            Part 3: Deploying a React App to Azure Blob Storage
          </Link>
        </li>
        <li>
          <Link href="/blog/bit-bucket-pipelines/part-four-deploying-a-function-app-to-azure-with-bicep">
            Part 4: Deploying a Function App to Azure with Bicep
          </Link>
        </li>
      </ul>
    </>
  )
}

export default BitBucketPipelinesSeriesHeader
