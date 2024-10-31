import axios, { type AxiosResponse } from 'axios'

const BASE_URL = 'http://localhost:9999' // Added 'http://' protocol

interface Newsletter {
  id?: number
  title: string
  description: string
}

interface NewsletterEntry {
  newsletterId: string
  title: string
  content: string
}

interface Recipient {
  id?: number
  email: string
  name?: string
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const newsletterService = {
  createNewsletter: (
    newsletterData: Omit<Newsletter, 'id'>,
  ): Promise<AxiosResponse<Newsletter>> => {
    console.log('newsletterData', newsletterData)
    return apiClient.post<Newsletter>('/newsletters/new', newsletterData)
  },
  getNewsletters: (): Promise<AxiosResponse<Newsletter[]>> => {
    return apiClient.get<Newsletter[]>('/newsletters/')
  },
  createEntry: (
    newsletterId: string,
    entryData: FormData,
  ): Promise<AxiosResponse<NewsletterEntry>> => {
    return apiClient.post<NewsletterEntry>(
      `/newsletters/entry/${newsletterId}`,
      entryData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },
}

export const recipientService = {
  createRecipient: (
    recipient: Omit<Recipient, 'id'>[],
  ): Promise<AxiosResponse<Recipient[]>> => {
    return apiClient.post<Recipient[]>('/recipients/create', recipient)
  },
  createMultipleRecipients: (
    recipients: Omit<Recipient, 'id'>[],
  ): Promise<AxiosResponse<Recipient[]>> => {
    return apiClient.post<Recipient[]>('/recipients/create/many', recipients)
  },
}

export const subscriptionService = {
  subscribe: (
    newsletterId: string,
    userId: string,
  ): Promise<AxiosResponse<{}>> => {
    return apiClient.post<{}>(`/subscriptions/create`, {
      userId,
      newsletterId,
    })
  },
  getSubscriptions: (): Promise<AxiosResponse<any[]>> => {
    return apiClient.get<any[]>('/subscriptions/')
  },
  getSubscriptionsByEmail: (email: string): Promise<AxiosResponse<any[]>> => {
    return apiClient.get<any[]>(`/subscriptions/email/${email}`)
  },
  unsubscribe: (subscriptionId: string): Promise<AxiosResponse<{}>> => {
    return apiClient.delete<{}>(`/subscriptions/delete/${subscriptionId}`)
  },
}
