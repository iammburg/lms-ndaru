import { Participation } from '@/payload-types'
import VideoModule from './VideoModule'
import QuizModule from './QuizModule'

interface CourseModuleProps {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function CourseModule({ module, participation, onCompleted }: CourseModuleProps) {
  switch (module.blockType) {
    case 'video':
      return <VideoModule module={module} participation={participation} onCompleted={onCompleted} />
    case 'quiz':
      return <QuizModule module={module} participation={participation} onCompleted={onCompleted} />
    default:
      return <div>Tipe module {module.blockType} tidak diketahui</div>
  }
}
