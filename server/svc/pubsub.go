package svc

import (
    "sync"
)

type Subscriber struct {
    Id string
    Channel chan interface{}
}
func (sub *Subscriber) Close() {
    close(sub.Channel)
}

type PubSub struct {
    mu sync.RWMutex
    subs map[string][]Subscriber
}

func newSubscriber(subId string) Subscriber {
    return Subscriber{
        Id: subId,
        Channel: make(chan interface{}),
    }
}

func NewPubSub() *PubSub {
    return &PubSub{
        subs: make(map[string][]Subscriber),
    }
}

func (ps *PubSub) Sub(subId string, topic string) Subscriber {
   ps.mu.Lock()
   defer ps.mu.Unlock()

   sub := newSubscriber(subId)
   ps.subs[topic] = append(ps.subs[topic], sub)
   return sub
}

func (ps *PubSub) Unsub(subId string, topic string) {
   ps.mu.Lock()
   defer ps.mu.Unlock()

   newSubs := []Subscriber{}
   for _, s := range ps.subs[topic] {
       if s.Id != subId {
           newSubs = append(newSubs, s)
       } else {
           s.Close()
       }
   }
   ps.subs[topic] = newSubs
}

func (ps *PubSub) Pub(message interface{}, topic string) {
    ps.mu.RLock()
    defer ps.mu.RUnlock()

    for _, sub := range ps.subs[topic] {
        sub.Channel <- message
    }
}
