import Link from 'next/link'

const BicepSeriesHeader = () => {
  return (
    <>
      <h2>Series</h2>
      <ul>
        <li>
          <Link href="/blog/bicep/part-one">
            Part 1: Introduction to Automating Azure Resource Creation
          </Link>
        </li>
        <li>
          <Link href="/blog/bicep/part-two">Part 2: Advanced Concepts and Features</Link>
        </li>
      </ul>
    </>
  )
}

export default BicepSeriesHeader
