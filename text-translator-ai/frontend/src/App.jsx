import { useState } from 'react'
import axios from 'axios'
import './App.css'

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Dutch', 'Russian', 'Mandarin Chinese', 'Japanese', 'Korean',
  'Arabic', 'Hindi', 'Malay', 'Indonesian', 'Vietnamese', 'Thai',
  'Turkish', 'Polish', 'Swedish',
]

const API_URL = 'http://localhost:8000'

function App() {
  const [userOutput, setUserOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    input_language: 'English',
    output_language: 'German',
    user_input: '',
  })

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const translateText = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/translate`, formData)
      setUserOutput(response.data.user_output)
    } catch (error) {
      console.log('Error posting inputs:', error)
      alert('Error posting inputs')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Text Translator</h1>
        <form onSubmit={translateText}>
          <div className="main-container">
            <div className="column">
              <fieldset>
                <legend>Input Language</legend>
                <select value={formData.input_language} onChange={updateField('input_language')}>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="grow">
                <legend>Enter text to translate</legend>
                <textarea
                  placeholder="Type something..."
                  value={formData.user_input}
                  onChange={updateField('user_input')}
                  required
                />
              </fieldset>
            </div>

            <div className="column">
              <fieldset>
                <legend>Output Language</legend>
                <select value={formData.output_language} onChange={updateField('output_language')}>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="grow">
                <legend>Translation</legend>
                <textarea
                  placeholder="Translation will appear here"
                  value={userOutput}
                  readOnly
                />
              </fieldset>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Translating…' : 'Translate'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App