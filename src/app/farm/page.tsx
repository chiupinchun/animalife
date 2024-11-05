import { getRandomByRate } from '@app/common/utils/math'
import { Card, CardContent } from '@mui/material'
import { FC, useState } from 'react'
import { CROP_MUTATION_RATE } from './constants/farm'

class FarmPlot {
  isLocked = true
  isMutated: boolean

  constructor(
    public seed: {
      harvestTime: Date
    }
  ) {
    this.isMutated = getRandomByRate(CROP_MUTATION_RATE)
  }
}

interface Props { }

const Farm: FC<Props> = () => {
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([])

  return (
    <>
      <div className='flex justify-center items-center w-screen h-screen'>
        <Card>
          <CardContent className='grid grid-cols-2 md:grid-cols-5 gap-5'>
            {farmPlots.map((plot, index) => (
              <div key={index}>
                地
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Farm
