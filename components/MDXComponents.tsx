import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import BicepSeriesHeader from '@/components/bicep/BicepSeriesHeader'
import BicepSeriesResources from '@/components/bicep/BicepSeriesResources'
import BitBucketPipelinesSeriesHeader from '@/components/bit-bucket/BitBucketPipelinesSeriesHeader'
import BitBucketPipelinesSeriesResources from '@/components/bit-bucket/BitBucketPipelinesSeriesResources'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  BicepSeriesHeader,
  BicepSeriesResources,
  BitBucketPipelinesSeriesHeader,
  BitBucketPipelinesSeriesResources,
}
