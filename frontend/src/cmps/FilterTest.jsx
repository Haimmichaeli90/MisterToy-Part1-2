import { useForm } from '../cmps/UseForm.jsx'



export function FilterTest() {

    const [register, fields] = useForm({ txt: '', price: 0, sortDir: true }, console.log)
 

    return (
        <section className="toy-filter">
            <h2>sdfsfdhgsdf</h2>

            <form className="contact-filter">
                <input {...register('txt', 'text')} />
                <input {...register('price', 'number')} />
                <input {...register('sortDir', 'checkbox')} />
            </form>

        </section>
    )
}
