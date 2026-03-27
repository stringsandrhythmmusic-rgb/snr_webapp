import api from './client'
import type { Enquiry, EnquiryCreate } from '@/types'

export const submitEnquiry = async (params: EnquiryCreate): Promise<Enquiry> => {
  const { data } = await api.post('/enquiry', params)
  return data
}
