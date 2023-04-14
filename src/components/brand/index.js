import { Elo, Visa, MasterCard, HiperCard, Generic } from '../../assets/svg'

export const Brand = ({ name }) => {
  switch (name) {
    case 'visa':
      return <Visa />
    case 'mastercard':
      return <MasterCard />
    case 'elo':
      return <Elo />
    case 'hipercard':
      return <HiperCard />
    default:
      return <Generic />
  }
}