# 🌊 TL;DR

### 디자인 원칙

- 상호작용하는 객체 사이에는 가능하면 느슨한 결합을 사용해야 한다.

### 옵저버 패턴

- 한 객체의 상태가 바뀌면 그 객체에 의존하는 다른 객체에게 연락이 가고 자동으로 내용이 갱신되는 방식으로 일대다(one-to-many) 의존성을 정의한다.

### 느슨한 결합

객체들이 상호작용할 수는 있지만, 서로를 잘 모르는 관계를 의미

- 주제는 옵저버가 특정 인터페이스(Observer 인터페이스)를 구현한다는 사실만 안다.
- 옵저버는 언제든지 새로 추가 & 제거할 수 있다.
- 새로운 형식의 옵저버를 추가할 때도 주제를 변경할 필요가 전혀 없다.
- 주제와 옵저버는 서로 독립적으로 재사용할 수 있다.
- 주제나 옵저버가 달라져도 서로에게 영향을 미치지는 않는다.

# 🍭 시나리오

> WeatherData 객체로 현재 조건, 기상 통계, 기상 예보 항목을 디스플레이 장비에서 갱신해 가면서 보여 주는 애플리케이션 만들기

- 기상 스테이션(실제 기상 정보를 수집하는 물리 장비)
- WeatherData 객체(기상 스테이션으로부터 오는 정보를 추적하는 객체)
- 사용자에게 현재 기상 조건을 보여 주는 디스플레이 장비

❗️ 나중에 새로운 디스플레이를 손쉽게 추가할 수 있도록 해야 한다.

> WeatherData에서 갱신된 값을 가져올 때마다 measurementsChanged() 메소드가 호출되어야 한다.

```java
public class WeatherData {

  // 인스턴스 변수
  ...

  // 기상 관측값이 갱신될 때마다 호출
  public void measurementsChanged() {
    float temp = getTemperature();
    float humidity = getHumidity();
    float pressure = getPressure();

    // 각 디스플레이 갱신
    currentConditionsDisplay.update(temp, humidity, pressure);
    statisticsDisplay.update(temp, humidity, pressure);
    forecastDisplay.update(temp, humidity, pressure);
  };

  public void getTemperature() {};
  public void getHumidity() {};
  public void getPressure() {};
}
```

> **❌문제 발생❌: 구체적인 구현에 맞춰서 코딩했으므로 프로그램을 고치지 않고는 다른 디스플레이 항목을 추가하거나 제거할 수 없다.**

# 📌 옵저버 패턴 (Observer Pattern)

- 한 객체의 상태가 바뀌면 그 객체에 의존하는 다른 객체에게 연락이 가고 자동으로 내용이 갱신되는 방식으로 일대다(one-to-many) 의존성을 정의한다.

## 옵저버 패턴 이해하기

쉽게 신문사(Subject)와 구독자(Observer)로 표현할 수 있다.

1. 주제에서 중요한 데이터를 관리한다.
2. 주제 데이터가 바뀌면 옵저버에게 그 소식이 전해진다.
3. 옵저버 객체들은 주제를 구독하고 있으며, 주제 데이터가 바뀌면 갱신 내용을 전달 받는다.

## 옵저버 패턴의 구조

![옵저버 패턴의 구조](https://github.com/SungSeokMin/book_design-patterns/assets/72539723/a4b69823-6f31-4914-b600-b115b1262f58)

## 느슨한 결합의 위력

**느슨한 결합**은 객체들이 상호작용할 수는 있지만, 서로를 잘 모르는 관계를 의미한다.  
따라서, 느슨한 결합을 활용하면 유연성이 좋아지며 옵저버 패턴은 느슨한 결합을 보여주는 훌륭한 예시 패턴이다.

옵저버 패턴에서 어떤 식으로 느슨한 결합을 만들 수 있을까?

- 주제는 옵저버가 특정 인터페이스(Observer 인터페이스)를 구현한다는 사실만 안다.
  - 옵저버의 구상 클래스가 무엇인지, 무엇을 하는지는 알 필요가 없다.
- 옵저버는 언제든지 새로 추가 & 제거할 수 있다.
  - 주제는 Observer 인터페이스를 구현하는 객체의 목록에만 의존하므로 언제든지 새로운 옵저버를 추가 & 삭제할 수 있다.
- 새로운 형식의 옵저버를 추가할 때도 주제를 변경할 필요가 전혀 없다.
  - 새로운 클래스에서 Observer 인터페이스를 구현하고 옵저버로 등록하기만 하면 된다.
- 주제와 옵저버는 서로 독립적으로 재사용할 수 있다.
- 주제나 옵저버가 달라져도 서로에게 영향을 미치지는 않는다.

## 옵저버 패턴 적용 (기상 스테이션 설계하기)

![옵저버 패턴 적용](https://github.com/SungSeokMin/book_design-patterns/assets/72539723/74bd216b-8d0f-42d4-bcda-5c38d59e9549)

### 인터페이스 정의

```java
public interface Subject {
  // 옵저버를 인자로 받고 등록 & 제거
  public void registerObserver(Observer o);
  public void removeObserver(Observer o);
  // 상태가 변경되는 경우 모든 옵저버에게 변경 내용을 알림
  public void notifyObservers();
}

public interface Observer {
  // 기상 정보 업데이트 후 옵저버에게 전달되는 상태값
  public void update(float temp, float humidity, float pressure);
}

public interface DisplayElement {
  // 디스플레이 화면에 노출
  public void display();
}
```

### Subject 인터페이스 구현

```java
public class WeatherData implements Subject {
  private List<Observer> observers;
  private float temperature;
  private float humidity;
  private float pressure;

  public WeatherData() {
    observers = new ArrayList<Observer>();
  }

  public void registerObserver(Observer o) {
    observers.add(o);
  }

  public void removeObserver(Observer o) {
    observers.remove(o);
  }

  public void notifyObservers() {
    for (Observer observer : observers) {
        observer.update(temperature, humidity, pressure);
	  }
  }

  public void measurementsChanged() {
    notifyObservers();
  }

	public void setMeasurements(float temperature, float humidity, float pressure) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    measurementsChanged();
  }

  public float getTemperature() {
    return temperature;
  }

  public float getHumidity() {
    return humidity;
  }

  public float getPressure() {
    return pressure;
  }
}
```

### 디스플레이 요소 구현

```java
public class CurrentConditionsDisplay implements Observer, DisplayElement {
  private float temperature;
  private float humidity;
  private WeatherData weatherData;

  public CurrentConditionsDisplay(WeatherData weatherData) {
    this.weatherData = weatherData;
    weatherData.registerObserver(this);
  }

  public void update(float temperature, float humidity, float pressure) {
    this.temperature = temperature;
    this.humidity = humidity;
    display();
	}

  public void display() {
    System.out.println("Current conditions: " + temperature
      + "F degrees and " + humidity + "% humidity");
  }
}
```

## Push & Pull

- **Push**: 주제가 옵저버에게 상태를 알리는 방식
- **Pull**: 옵저버가 주제로부터 상태를 끌어오는 방식

애플리케이션이 점점 복잡해진다는 가정하에 Pull 방식으로 구현하는게 더 좋다.

### Push 방식

옵저버의 update 메소드를 인자 없이 호출하도록 notifyObservers() 메소드를 수정한다.

```java
public void notifyObservers() {
  for (Observer observer: observers) {
    observer.update();
  }
}
```

### Pull 방식

Observer 인터페이스에서 update() 메소드에 매개변수가 없도록 서명을 바꿔준다.

```java
public interface Observer {
  public void update();
}
```

CurrentConditionsDisplay 클래스의 update() 메소드를 다음과 같이 변경한다.

```java
public void update() {
  this.temperature = weatherData.getTemperature();
  this.humidity = weatherData.getHumidity();
  display();
}
```
