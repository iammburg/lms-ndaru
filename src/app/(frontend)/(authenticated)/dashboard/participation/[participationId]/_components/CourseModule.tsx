import { Participation } from '@/payload-types'
import VideoModule from './VideoModule'
import QuizModule from './QuizModule'
import FinishModule from './FinishModule'

interface CourseModuleProps {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
  totalModules: number
  onParticipationUpdate: (participation: Participation) => void
}

export default function CourseModule({
  module,
  participation,
  onCompleted,
  totalModules,
  onParticipationUpdate,
}: CourseModuleProps) {
  // Guard against undefined module
  if (!module) {
    return <div className="text-red-500">Module not found</div>
  }

  switch (module.blockType) {
    case 'video':
      return (
        <VideoModule
          module={module}
          participation={participation}
          onCompleted={onCompleted}
          totalModules={totalModules}
          onParticipationUpdate={onParticipationUpdate}
        />
      )
    case 'quiz':
      return (
        <QuizModule
          module={module}
          participation={participation}
          onCompleted={onCompleted}
          totalModules={totalModules}
          onParticipationUpdate={onParticipationUpdate}
        />
      )
    case 'finish':
      return <FinishModule participation={participation} />
    default:
      return <div>Tipe module {module.blockType} tidak diketahui</div>
  }
}
