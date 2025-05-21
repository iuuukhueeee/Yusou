import { UUIDResponse } from "@/app/api/uuid/types"
import { useQuery } from "@tanstack/react-query"

const useUUID = () => {
  return useQuery<UUIDResponse, Error>({
    queryKey: ['/uuid/get'],
    queryFn: async () => {
      const response = await fetch('/api/uuid', { method: 'GET' })
      return response.json()
    },
    enabled: false, // Disable automatic fetching
  })
}

export default useUUID