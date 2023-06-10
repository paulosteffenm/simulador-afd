export class Transition{
  public From?: string = '';
  public Input?: string = '';
  public To?: string = '';
  public Order: 'first' | 'second' = 'first'

  constructor(transition?: Partial<Transition>){
    Object.assign(this, transition);
  }
}
