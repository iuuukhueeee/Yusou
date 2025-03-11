import Image from 'next/image'

interface Props {
  objectKey: string
  presignedLink: string
}

function ImageWithLink({ objectKey, presignedLink }: Props) {
  return (
    <Image
      src={presignedLink}
      alt={objectKey}
      width={250}
      height={250}
      onClick={() => window.open(presignedLink, '_blank')}
      className="cursor-pointer"
    />
  )
}

export default ImageWithLink
