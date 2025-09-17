import { Participation } from '@/payload-types'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import NextButton from './NextButton'
import { markProgress } from '../_actions/markProgress'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'

interface QuizModuleProps {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function QuizModule({ module, participation, onCompleted }: QuizModuleProps) {
  const [message, setMessage] = useState<string>('')
  const [userAnswers, setUserAnswers] = useState<boolean[][]>([])
  const [loading, setLoading] = useState(false)
  const [allAnswerCorrect, setAllAnswerCorrect] = useState(false)

  function setEmptyUserAnswer() {
    const tempAnswers = module.questions.map((question: any) => {
      return question.answers.map(() => false)
    })

    setUserAnswers(tempAnswers)
  }

  useEffect(() => {
    setEmptyUserAnswer()
  }, [])

  async function handleNextModule() {
    setLoading(true)
    try {
      const updateParticipation = await markProgress(participation)
      if (updateParticipation && updateParticipation.progress) {
        onCompleted(updateParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function checkAnswer(questionIndex: number) {
    let correct = true
    let length = module.questions[questionIndex].answers.length

    for (let i = 0; i < length; i++) {
      let expectedValue = module.questions[questionIndex].answers[i].correct ? true : false
      let userValue = userAnswers[questionIndex]?.[i] || false

      if (expectedValue !== userValue) {
        correct = false
        break
      }
    }
    return correct
  }

  function checkAllAnswers() {
    for (let i = 0; i < module.questions.length; i++) {
      if (!checkAnswer(i)) {
        return false
      }
    }
    return true
  }

  function handleCheckAnswers() {
    if (checkAllAnswers()) {
      setAllAnswerCorrect(true)
      setMessage('Selamat! Semua jawaban benar. Silakan lanjut ke modul berikutnya.')
    } else {
      setAllAnswerCorrect(false)
      setMessage('Beberapa jawaban masih ada yang salah, silakan coba lagi.')
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>

      <div className="space-y-6">
        {module.questions.map((question: any, index: number) => (
          <Card key={index} className="border-2 border-secondary py-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {question.answers.map((answer: any, answerIndex: number) => (
                  <div
                    key={`${index}-${answerIndex}`}
                    className="flex items-center space-x-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`answer-${index}-${answerIndex}`}
                      checked={userAnswers[index]?.[answerIndex] || false}
                      onCheckedChange={(checked) => {
                        setMessage('')
                        setAllAnswerCorrect(false)

                        const tempAnswers = [...userAnswers]
                        if (!tempAnswers[index]) {
                          tempAnswers[index] = []
                        }
                        tempAnswers[index][answerIndex] = checked === true
                        setUserAnswers(tempAnswers)
                      }}
                    />
                    <Label
                      htmlFor={`answer-${index}-${answerIndex}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {answer.answer}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {message && (
        <Card
          className={`py-2 ${
            allAnswerCorrect
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
              : 'border-red-500 bg-red-50 dark:bg-red-950/20'
          }`}
        >
          <CardContent>
            <div className="flex items-center gap-3">
              {allAnswerCorrect ? (
                <CheckCircle className="size-4 text-green-600" />
              ) : (
                <XCircle className="size-4 text-red-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  allAnswerCorrect
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
              >
                {message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-start">
        {allAnswerCorrect ? (
          <NextButton
            loading={loading}
            text="Lanjut ke Modul Berikutnya"
            onClick={handleNextModule}
          />
        ) : (
          <Button
            onClick={handleCheckAnswers}
            disabled={allAnswerCorrect}
            size="lg"
            className="w-full sm:w-auto"
          >
            <HelpCircle className="size-4" />
            Periksa Jawaban
          </Button>
        )}
      </div>
      <Separator className="mt-8" />
    </div>
  )
}
